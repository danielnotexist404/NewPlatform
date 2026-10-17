"use client";
import * as React from "react";
import { toast } from "sonner";
import { ArrowLeftRight, Archive, EllipsisVertical, MailPlus, Plus, Play, Check, PenLine } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tag as Badge } from "@/components/settings/kit";
import { Input, LtrInput } from "@/components/ui/input";
import { Field } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Tooltip } from "@/components/ui/tooltip";
import { Panel, Section, StatusPill, TableShell, EmptyState, ButtonLink, DemoBadge } from "@/components/settings/kit";
import { InviteDialog } from "./team-view";
import { clientsCopy as c, teamCopy, accountCommon } from "@/content/he/account";
import { BRAND } from "@/lib/constants";
import { MOCK_CLIENTS, MOCK_WORKSPACE, PLAN_EXTRA_LIMITS } from "@/lib/mock/account";
import { fill, formatInt } from "@/components/settings/format";

type Client = (typeof MOCK_CLIENTS)[number];

export function ClientsView() {
  const isAgency = MOCK_WORKSPACE.planId === "agency";
  return (
    <div className="flex flex-col gap-10">
      {!isAgency && (
        <Panel tone="gold" className="relative overflow-hidden">
          <div aria-hidden className="pointer-events-none absolute inset-0 bg-projector" />
          <EmptyState
            illustration="clients"
            size="page"
            title={c.upsellTitle}
            description={c.upsellBody}
            action={<ButtonLink href="/app/billing/plans?plan=agency" variant="primary" size="lg">{accountCommon.comparePlans}</ButtonLink>}
            className="relative"
          />
        </Panel>
      )}
      {isAgency ? (
        <AgencyClients />
      ) : (
        <Section id="agency-preview" title={<span className="flex items-center gap-2">{c.previewTitle}<Badge variant="violet">{c.previewBadge}</Badge></span>}>
          <AgencyClients preview />
        </Section>
      )}
    </div>
  );
}

function AgencyClients({ preview = false }: { preview?: boolean }) {
  const [clients, setClients] = React.useState<Client[]>(MOCK_CLIENTS);
  const [newOpen, setNewOpen] = React.useState(false);
  const [archive, setArchive] = React.useState<Client | null>(null);
  const [inviteFor, setInviteFor] = React.useState<Client | null>(null);
  const max = PLAN_EXTRA_LIMITS.agency.clientWorkspaces;

  return (
    <div className="flex flex-col gap-6">
      <WhiteLabelCard />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <p className="text-body-lg font-bold">{fill(c.count, { n: formatInt(clients.length) })}</p>
          {preview && <DemoBadge />}
        </div>
        <Button onClick={() => setNewOpen(true)} disabled={clients.length >= max}><Plus aria-hidden />{c.newClient}</Button>
      </div>

      {clients.length === 0 ? (
        <Panel>
          <EmptyState illustration="clients" title={c.emptyTitle} description={c.emptyBody} action={<Button onClick={() => setNewOpen(true)}>{c.newClient}</Button>} />
        </Panel>
      ) : (
        <Panel className="pb-2 md:pb-2">
          <TableShell>
            <caption className="sr-only">{c.tableCaption}</caption>
            <thead>
              <tr>
                <th scope="col">{c.columns.client}</th>
                <th scope="col">{c.columns.brand}</th>
                <th scope="col" className="text-center">{c.columns.projects}</th>
                <th scope="col">{c.columns.activity}</th>
                <th scope="col" className="text-center">{c.columns.credits}</th>
                <th scope="col" className="text-center">{c.columns.approvals}</th>
                <th scope="col"><span className="sr-only">{c.columns.actions}</span></th>
              </tr>
            </thead>
            <tbody>
              {clients.map((cl) => (
                <tr key={cl.id}>
                  <th scope="row">
                    <span className="flex items-center gap-3">
                      <span className="flex size-9 shrink-0 items-center justify-center rounded-sm text-sm font-extrabold" style={{ background: cl.colors[0], color: cl.colors[3] }} aria-hidden>{cl.initials}</span>
                      <span dir="auto" className="font-semibold text-text">{cl.name}</span>
                    </span>
                  </th>
                  <td>
                    <span className="flex [&>*+*]:-ms-1.5" aria-hidden>
                      {cl.colors.map((col) => <span key={col} className="size-5 rounded-full shadow-[0_0_0_2px_var(--color-surface-1)]" style={{ background: col }} />)}
                    </span>
                  </td>
                  <td className="text-center"><bdi className="num">{formatInt(cl.projects)}</bdi></td>
                  <td className="whitespace-nowrap text-text-2">{cl.lastActivityHe}</td>
                  <td className="text-center">
                    <Tooltip content={c.creditsTooltip}>
                      <bdi tabIndex={0} className="num font-semibold">{formatInt(cl.creditsThisMonth)}</bdi>
                    </Tooltip>
                  </td>
                  <td className="text-center">
                    {cl.pendingApprovals > 0 ? <StatusPill tone="waiting"><bdi className="num">{cl.pendingApprovals}</bdi></StatusPill> : <span className="text-muted">0</span>}
                  </td>
                  <td>
                    <span className="flex items-center justify-end gap-1">
                      <Button size="sm" variant="secondary" onClick={() => toast.success(fill(c.switched, { name: cl.name }))}>
                        <ArrowLeftRight aria-hidden />{c.switchTo}
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button size="icon-sm" variant="ghost" aria-label={fill(c.moreActions, { name: cl.name })}><EllipsisVertical aria-hidden /></Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem onSelect={() => setInviteFor(cl)}><MailPlus aria-hidden />{c.inviteClient}</DropdownMenuItem>
                          <DropdownMenuItem onSelect={() => setArchive(cl)}><Archive aria-hidden />{c.archive}</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </TableShell>
        </Panel>
      )}

      <NewClientDialog
        open={newOpen}
        onOpenChange={setNewOpen}
        onCreate={(name) => {
          setClients((l) => [...l, { id: `c-${l.length + 1}`, name, initials: name.slice(0, 1), colors: ["#FFB547", "#121219", "#8E7BFF", "#FFFFFF"], projects: 0, lastActivityHe: teamCopy.justNow, creditsThisMonth: 0, pendingApprovals: 0 }]);
          toast.success(fill(c.dialog.ready, { clientName: name }));
        }}
      />

      <InviteDialog
        open={!!inviteFor}
        onOpenChange={(o) => !o && setInviteFor(null)}
        full={false}
        seatsCopy=""
        memberEmails={[]}
        invitedEmails={[]}
        defaultRole="viewer"
        onSent={() => setInviteFor(null)}
      />

      <Dialog open={!!archive} onOpenChange={(o) => !o && setArchive(null)}>
        <DialogContent>
          <DialogTitle>{c.archiveTitle}</DialogTitle>
          <DialogDescription>{c.archiveBody}</DialogDescription>
          <div className="mt-6 flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setArchive(null)}>{accountCommon.close}</Button>
            <ButtonLink href="/contact?topic=support" variant="primary">{accountCommon.contactUs}</ButtonLink>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function WhiteLabelCard() {
  const on = MOCK_WORKSPACE.whiteLabel;
  return (
    <Panel className="grid gap-6 md:grid-cols-[1fr_260px] md:items-center">
      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="text-body-lg font-bold">{fill(c.whiteLabel.title, { brand: BRAND.nameHe })}</h3>
          <StatusPill tone={on ? "success" : "neutral"}>{on ? c.whiteLabel.on : c.whiteLabel.off}</StatusPill>
        </div>
        <p className="text-small text-text-2">{c.whiteLabel.body}</p>
        <ButtonLink href={`/contact?topic=support&subject=${encodeURIComponent(on ? c.whiteLabel.requestOff : c.whiteLabel.requestOn)}`} variant="secondary" className="w-fit">
          {on ? c.whiteLabel.requestOff : c.whiteLabel.requestOn}
        </ButtonLink>
      </div>
      {/* Mini preview of /approve/[token] with the agency's branding */}
      <figure aria-label={c.whiteLabel.previewLabel} className="rounded-md bg-bg p-3 shadow-[inset_0_0_0_1px_var(--color-frame)]">
        <div className="mb-2 flex items-center gap-2">
          <span className="size-5 rounded-xs bg-violet" aria-hidden />
          <span className="text-micro text-text-2">{c.whiteLabel.previewAgency}</span>
        </div>
        <div className="relative mx-auto flex aspect-reel w-24 items-center justify-center overflow-hidden rounded-sm bg-surface-3 bg-afterglow" aria-hidden>
          <Play className="size-5 text-text" />
        </div>
        <p className="mt-2 text-center text-micro">{c.whiteLabel.previewTitle}</p>
        <div className="mt-2 grid grid-cols-2 gap-1.5" aria-hidden>
          <span className="flex items-center justify-center gap-1 rounded-full bg-primary py-1 text-[0.6875rem] font-bold text-on-primary"><Check className="size-3" />{c.whiteLabel.previewApprove}</span>
          <span className="flex items-center justify-center gap-1 rounded-full bg-surface-3 py-1 text-[0.6875rem] font-bold"><PenLine className="size-3" />{c.whiteLabel.previewChanges}</span>
        </div>
      </figure>
    </Panel>
  );
}

function NewClientDialog({ open, onOpenChange, onCreate }: { open: boolean; onOpenChange: (o: boolean) => void; onCreate: (name: string) => void }) {
  const [name, setName] = React.useState("");
  const [link, setLink] = React.useState("");
  const [err, setErr] = React.useState<string | null>(null);
  const [busy, setBusy] = React.useState(false);
  React.useEffect(() => {
    if (!open) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reset each time the dialog opens
    setName(""); setLink(""); setErr(null); setBusy(false);
  }, [open]);
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogTitle>{c.dialog.title}</DialogTitle>
        <DialogDescription className="sr-only">{c.dialog.title}</DialogDescription>
        <form
          noValidate
          className="mt-5 flex flex-col gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            if (!name.trim()) { setErr(c.dialog.nameRequired); return; }
            setBusy(true);
            setTimeout(() => { onCreate(name.trim()); onOpenChange(false); }, 800);
          }}
        >
          <Field label={c.dialog.name} htmlFor="client-name" error={err ?? undefined}>
            <Input id="client-name" dir="auto" value={name} onChange={(e) => { setName(e.target.value); setErr(null); }} aria-invalid={!!err} aria-describedby={err ? "client-name-error" : undefined} />
          </Field>
          <Field label={c.dialog.link} htmlFor="client-link">
            <LtrInput id="client-link" type="url" inputMode="url" placeholder={c.dialog.linkPlaceholder} value={link} onChange={(e) => setLink(e.target.value)} />
          </Field>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>{accountCommon.cancel}</Button>
            <Button type="submit" loading={busy}>{busy ? c.dialog.creating : c.dialog.create}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
