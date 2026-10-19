"use client";
import * as React from "react";
import { ChevronDown, Inbox, MessageCircle, Phone as PhoneIcon } from "lucide-react";
import { toast } from "sonner";
import { leads as SEED, type Lead, type LeadStatus } from "@/lib/mock/leads";
import { SAMPLE_BUSINESS } from "@/lib/mock/campaigns";
import { leadsCopy as L } from "@/content/he/campaigns-app";
import { dateShort, fmt, Phone, timeOf } from "@/components/campaigns/text";
import { cn } from "@/lib/utils";

const STATUSES: LeadStatus[] = ["new", "in_progress", "closed"];
const STATUS_TONE: Record<LeadStatus, string> = {
  new: "bg-primary/15 text-primary-text",
  in_progress: "bg-violet/12 text-violet",
  closed: "bg-success/12 text-success",
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

/** Simple leads list: filter by status, call or WhatsApp in one tap, expand for the answers. */
export function LeadsInbox() {
  const [items, setItems] = React.useState<Lead[]>(() => SEED.filter((l) => !l.isTest));
  const [filter, setFilter] = React.useState<LeadStatus | "all">("all");
  const [open, setOpen] = React.useState<string | null>(null);
  const shown = items.filter((l) => filter === "all" || l.status === filter);
  const count = (k: LeadStatus | "all") => (k === "all" ? items.length : items.filter((l) => l.status === k).length);

  const setStatus = (id: string, status: LeadStatus) => {
    setItems((list) => list.map((l) => (l.id === id ? { ...l, status } : l)));
    toast.success(fmt(L.statusToast, { status: L.status[status] }));
  };

  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-2">
        <h1 className="text-h1">{L.title}</h1>
        <p className="text-small text-muted">נתוני דוגמה</p>
      </header>

      <div role="tablist" aria-label={L.statusLabel} className="flex flex-wrap gap-2">
        {(["all", ...STATUSES] as const).map((k) => {
          const on = k === filter;
          return (
            <button
              key={k}
              type="button"
              role="tab"
              aria-selected={on}
              onClick={() => setFilter(k)}
              className={cn(
                "inline-flex h-10 items-center gap-2 rounded-full px-4 text-small font-semibold ring-1 transition-colors",
                on ? "bg-ink text-paper ring-ink" : "bg-surface-1 text-text-2 ring-border hover:text-text",
              )}
            >
              {k === "all" ? L.all : L.status[k]}
              <bdi className="num text-micro opacity-60">{count(k)}</bdi>
            </button>
          );
        })}
      </div>

      {shown.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-xl bg-surface-1 p-12 text-center text-text-2 ring-hairline">
          <Inbox className="size-8" aria-hidden />
          {L.empty}
        </div>
      ) : (
        <ul className="flex flex-col gap-3">
          {shown.map((l) => {
            const expanded = open === l.id;
            const first = l.answers[0];
            return (
              <li key={l.id} className="rounded-xl bg-surface-1 elev-1 ring-hairline">
                <div className="flex items-center gap-3 p-4 md:gap-4 md:p-5">
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-surface-3 text-body font-bold" aria-hidden>
                    {l.fullName.slice(0, 1)}
                  </span>
                  <button
                    type="button"
                    onClick={() => setOpen(expanded ? null : l.id)}
                    aria-expanded={expanded}
                    aria-controls={`lead-${l.id}`}
                    className="flex min-w-0 flex-1 flex-col items-start gap-1 text-start"
                  >
                    <span className="flex items-center gap-2">
                      <span className="text-body font-bold">{l.fullName}</span>
                      <span className={cn("rounded-full px-2 py-0.5 text-micro", STATUS_TONE[l.status])}>{L.status[l.status]}</span>
                    </span>
                    <span className="flex w-full items-center gap-1.5 text-micro font-normal text-muted">
                      <span className="shrink-0">{ago(l)}</span>
                      <span aria-hidden>·</span>
                      <span className="shrink-0">{L.source[l.source]}</span>
                      {first && (
                        <>
                          <span aria-hidden className="hidden md:inline">·</span>
                          <span className="hidden truncate text-text-2 md:inline">{first.a}</span>
                        </>
                      )}
                      <ChevronDown className={cn("ms-auto size-4 shrink-0 transition-transform md:hidden", expanded && "rotate-180")} aria-hidden />
                    </span>
                  </button>
                  <div className="flex shrink-0 items-center gap-2">
                    <a href={`tel:${l.phoneE164}`} aria-label={`${L.call} ${l.fullName}`} className="flex size-11 items-center justify-center rounded-full text-text ring-1 ring-border-strong hover:bg-surface-2">
                      <PhoneIcon className="size-[18px]" aria-hidden />
                    </a>
                    <a
                      href={waHref(l)}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${L.whatsapp} ${l.fullName}`}
                      className="flex h-11 items-center gap-2 rounded-full bg-ink px-3.5 text-small font-bold text-paper hover:opacity-90 md:px-5"
                    >
                      <MessageCircle className="size-[18px]" aria-hidden />
                      <span className="hidden md:inline">{L.whatsapp}</span>
                    </a>
                  </div>
                </div>
                <div id={`lead-${l.id}`} hidden={!expanded} className="flex flex-col gap-4 border-t border-border px-4 py-4 md:px-5 md:ps-[76px]">
                  <dl className="grid gap-3 sm:grid-cols-2">
                    <div className="flex flex-col">
                      <dt className="text-micro font-normal text-muted">{L.detail.contact}</dt>
                      <dd className="text-small font-semibold"><Phone value={l.phoneDisplay} />{l.city ? ` · ${l.city}` : ""}</dd>
                    </div>
                    {l.answers.map((a) => (
                      <div key={a.q} className="flex flex-col">
                        <dt className="text-micro font-normal text-muted">{a.q}</dt>
                        <dd className="text-small font-semibold">{a.a}</dd>
                      </div>
                    ))}
                    {l.campaignName && (
                      <div className="flex flex-col">
                        <dt className="text-micro font-normal text-muted">{L.campaignLabel}</dt>
                        <dd className="text-small font-semibold">{l.campaignName}</dd>
                      </div>
                    )}
                  </dl>
                  <div className="flex flex-wrap items-center gap-2" role="group" aria-label={L.statusLabel}>
                    {STATUSES.map((s) => (
                      <button
                        key={s}
                        type="button"
                        aria-pressed={l.status === s}
                        onClick={() => l.status !== s && setStatus(l.id, s)}
                        className={cn("h-9 rounded-full px-4 text-small font-semibold ring-1", l.status === s ? "bg-ink text-paper ring-ink" : "text-text-2 ring-border hover:text-text")}
                      >
                        {L.status[s]}
                      </button>
                    ))}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
