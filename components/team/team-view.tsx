"use client";
import * as React from "react";
import { toast } from "sonner";
import { Crown, MailPlus, RotateCw, Trash2, UserMinus, X, Shield, PenLine, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LtrInput } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, Progress } from "@/components/ui/misc";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { NativeSelect } from "@/components/settings/controls";
import { Panel, Section, StatusPill, TableShell, Note, ButtonLink, EmptyState, PageHeader } from "@/components/settings/kit";
import { teamCopy as t, ROLE_LABEL, ROLE_DESCRIPTION, accountCommon } from "@/content/he/account";
import { MOCK_INVITES, MOCK_MEMBERS, MOCK_WORKSPACE, PLAN_EXTRA_LIMITS, type MemberRole } from "@/lib/mock/account";
import { fill, formatDateHe, formatInt, isEmail, plural } from "@/components/settings/format";

const ROLE_ICON = { owner: Crown, admin: Shield, editor: PenLine, viewer: Eye } as const;
const counts = (r: MemberRole) => r !== "viewer";

export function TeamView() {
  const [members, setMembers] = React.useState(MOCK_MEMBERS);
  const [invites, setInvites] = React.useState(MOCK_INVITES);
  const [inviteOpen, setInviteOpen] = React.useState(false);
  const [removeId, setRemoveId] = React.useState<string | null>(null);
  const max = PLAN_EXTRA_LIMITS[MOCK_WORKSPACE.planId].seats;
  const used = members.filter((m) => counts(m.role)).length + invites.filter((i) => counts(i.role)).length;
  const full = used >= max;
  const seatsCopy = plural(max, t.seatsLimit);
  const toRemove = members.find((m) => m.id === removeId);
  const solo = members.length === 1 && invites.length === 0;

  const changeRole = (id: string, role: MemberRole) => {
    const m = members.find((x) => x.id === id)!;
    if (counts(role) && !counts(m.role) && full) {
      toast.error(seatsCopy);
      return;
    }
    setMembers((list) => list.map((x) => (x.id === id ? { ...x, role } : x)));
    toast.success(t.roleChanged);
  };

  return (
    <>
      <PageHeader
        title={t.title}
        actions={<Button size="lg" onClick={() => setInviteOpen(true)}><MailPlus aria-hidden />{t.invite}</Button>}
      />
      <div className="flex flex-col gap-10">
        <Panel className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between md:gap-8">
          <div className="flex flex-1 flex-col gap-2">
            <p className="text-body-lg font-bold">
              {t.seats.split("{used}")[0]}<bdi className="num">{formatInt(used)}</bdi>{t.seats.split("{used}")[1].split("{max}")[0]}<bdi className="num">{formatInt(max)}</bdi>
            </p>
            <Progress value={(used / max) * 100} aria-label={fill(t.seats, { used, max })} />
            <p className="text-small text-text-2">{t.seatsHelp}</p>
          </div>
          {full && (
            <Note tone="warning" className="md:max-w-md">
              <p>{seatsCopy}</p>
              <ButtonLink href="/app/billing/plans" variant="link" size="sm" className="mt-1 h-auto">{accountCommon.comparePlans}</ButtonLink>
            </Note>
          )}
        </Panel>

        {solo ? (
          <Panel>
            <EmptyState
              illustration="team"
              title={t.emptyTitle}
              description={t.emptyBody}
              action={<Button onClick={() => setInviteOpen(true)}>{t.invite}</Button>}
            />
          </Panel>
        ) : (
          <Section id="members" title={t.tableCaption}>
            <Panel className="pb-2 md:pb-2">
              <TableShell>
                <caption className="sr-only">{t.tableCaption}</caption>
                <thead>
                  <tr>
                    <th scope="col">{t.columns.member}</th>
                    <th scope="col">{t.columns.email}</th>
                    <th scope="col">{t.columns.role}</th>
                    <th scope="col">{t.columns.joined}</th>
                    <th scope="col"><span className="sr-only">{t.columns.actions}</span></th>
                  </tr>
                </thead>
                <tbody>
                  {members.map((m) => (
                    <tr key={m.id}>
                      <th scope="row">
                        <span className="flex items-center gap-3">
                          <Avatar name={m.name} />
                          <span className="flex flex-col">
                            <span dir="auto" className="font-semibold text-text">{m.name}</span>
                            {m.isYou && <span className="text-micro font-normal text-muted">{t.you}</span>}
                          </span>
                        </span>
                      </th>
                      <td><bdi dir="ltr" className="text-text-2">{m.email}</bdi></td>
                      <td>
                        {m.role === "owner" ? (
                          <span className="inline-flex items-center gap-1.5 font-semibold" title={t.ownerFixed}>
                            <Crown className="size-4 text-primary-text" aria-hidden />{ROLE_LABEL.owner}
                          </span>
                        ) : (
                          <NativeSelect
                            aria-label={fill(t.roleSelectSr, { name: m.name })}
                            value={m.role}
                            onChange={(e) => changeRole(m.id, e.target.value as MemberRole)}
                            className="w-40"
                          >
                            {(["admin", "editor", "viewer"] as const).map((r) => (
                              <option key={r} value={r}>{ROLE_LABEL[r]}</option>
                            ))}
                          </NativeSelect>
                        )}
                      </td>
                      <td className="whitespace-nowrap text-text-2">{formatDateHe(m.joinedAt)}</td>
                      <td className="text-end">
                        {m.role !== "owner" && (
                          <Button size="sm" variant="ghost" onClick={() => setRemoveId(m.id)}>
                            <UserMinus aria-hidden />
                            {t.remove}
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </TableShell>
            </Panel>
          </Section>
        )}

        {invites.length > 0 && (
          <Section id="invites" title={t.pendingTitle}>
            <Panel className="flex flex-col divide-y divide-border py-2 md:py-2">
              {invites.map((inv) => (
                <div key={inv.id} className="flex flex-col gap-3 py-3.5 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3">
                    <span className="flex size-9 items-center justify-center rounded-full bg-surface-2 text-text-2"><MailPlus className="size-4" aria-hidden /></span>
                    <div className="flex flex-col">
                      <span className="flex flex-wrap items-center gap-2">
                        <bdi dir="ltr" className="font-semibold">{inv.email}</bdi>
                        <StatusPill tone="waiting">{t.pending}</StatusPill>
                        <Badge variant="outline">{ROLE_LABEL[inv.role]}</Badge>
                      </span>
                      <span className="text-small text-text-2">{fill(t.sentLine, { relative: inv.sentRelativeHe, date: formatDateHe(inv.expiresAt) })}</span>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button size="sm" variant="secondary" onClick={() => toast.success(fill(t.resent, { email: inv.email }))}><RotateCw aria-hidden />{t.resend}</Button>
                    <Button size="sm" variant="ghost" onClick={() => { setInvites((l) => l.filter((x) => x.id !== inv.id)); toast(t.revoked); }}><Trash2 aria-hidden />{t.revoke}</Button>
                  </div>
                </div>
              ))}
            </Panel>
          </Section>
        )}

        <Section id="roles" title={t.rolesTitle}>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {(["owner", "admin", "editor", "viewer"] as const).map((r) => {
              const I = ROLE_ICON[r];
              return (
                <Panel key={r} className="flex flex-col gap-2 p-5 md:p-5">
                  <span className="flex size-9 items-center justify-center rounded-sm bg-surface-2 text-primary-text"><I className="size-4.5" aria-hidden /></span>
                  <h3 className="font-bold">{ROLE_LABEL[r]}</h3>
                  <p className="text-small text-text-2">{ROLE_DESCRIPTION[r]}</p>
                </Panel>
              );
            })}
          </div>
        </Section>
      </div>

      <InviteDialog
        open={inviteOpen}
        onOpenChange={setInviteOpen}
        full={full}
        seatsCopy={seatsCopy}
        memberEmails={members.map((m) => m.email)}
        invitedEmails={invites.map((i) => i.email)}
        onSent={(emails, role) => setInvites((l) => [...l, ...emails.map((email, k) => ({ id: `i-${l.length + k + 2}`, email, role, sentRelativeHe: t.justNow, expiresAt: "2026-10-24" }))])}
      />

      <Dialog open={!!toRemove} onOpenChange={(o) => !o && setRemoveId(null)}>
        <DialogContent>
          <DialogTitle>{fill(t.removeTitle, { name: toRemove?.name ?? "" })}</DialogTitle>
          <DialogDescription>{t.removeBody}</DialogDescription>
          <div className="mt-6 flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setRemoveId(null)}>{accountCommon.cancel}</Button>
            <Button
              variant="destructive"
              onClick={() => {
                setMembers((l) => l.filter((x) => x.id !== removeId));
                toast(fill(t.removed, { name: toRemove?.name ?? "" }));
                setRemoveId(null);
              }}
            >
              {t.removeConfirm}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export function InviteDialog({
  open, onOpenChange, full, seatsCopy, memberEmails, invitedEmails, onSent, defaultRole,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  full: boolean;
  seatsCopy: string;
  memberEmails: string[];
  invitedEmails: string[];
  onSent: (emails: string[], role: MemberRole) => void;
  defaultRole?: MemberRole;
}) {
  const [emails, setEmails] = React.useState<string[]>([]);
  const [draft, setDraft] = React.useState("");
  const [role, setRole] = React.useState<MemberRole>(defaultRole ?? (full ? "viewer" : "editor"));
  const [error, setError] = React.useState<string | null>(null);
  const [sending, setSending] = React.useState(false);

  React.useEffect(() => {
    if (!open) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reset each time the dialog opens
    setEmails([]); setDraft(""); setError(null); setSending(false);
    setRole(defaultRole ?? (full ? "viewer" : "editor"));
  }, [open, full, defaultRole]);

  const commit = (raw: string): boolean => {
    const parts = raw.split(/[,\s]+/).map((x) => x.trim()).filter(Boolean);
    for (const e of parts) {
      if (!isEmail(e)) { setError(t.dialog.invalid); return false; }
      if (memberEmails.includes(e)) { setError(fill(t.dialog.alreadyMember, { email: e })); return false; }
      if (invitedEmails.includes(e)) { setError(fill(t.dialog.alreadyInvited, { email: e })); return false; }
    }
    setError(null);
    setEmails((l) => Array.from(new Set([...l, ...parts])));
    setDraft("");
    return true;
  };

  const send = (e: React.FormEvent) => {
    e.preventDefault();
    let list = emails;
    if (draft.trim()) {
      if (!commit(draft)) return;
      list = Array.from(new Set([...emails, ...draft.split(/[,\s]+/).filter(Boolean)]));
    }
    if (!list.length) { setError(t.dialog.needEmail); return; }
    if (full && role !== "viewer") { setError(seatsCopy); return; }
    setSending(true);
    setTimeout(() => {
      onSent(list, role);
      list.forEach((x) => toast.success(fill(t.dialog.sent, { email: x })));
      onOpenChange(false);
    }, 700);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogTitle>{t.dialog.title}</DialogTitle>
        <DialogDescription>{t.dialog.description}</DialogDescription>
        <form onSubmit={send} noValidate className="mt-5 flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="invite-emails">{t.dialog.emails}</Label>
            <div className="flex min-h-11 flex-wrap items-center gap-1.5 rounded-sm border border-border-strong bg-surface-2 p-1.5 focus-within:outline-2 focus-within:outline-focus" dir="ltr">
              {emails.map((x) => (
                <span key={x} className="inline-flex items-center gap-1 rounded-xs bg-surface-3 py-0.5 ps-2 pe-1 text-sm">
                  {x}
                  <button type="button" aria-label={fill(t.dialog.removeEmail, { email: x })} onClick={() => setEmails((l) => l.filter((y) => y !== x))} className="rounded-xs p-0.5 text-text-2 hover:text-text">
                    <X className="size-3.5" aria-hidden />
                  </button>
                </span>
              ))}
              <LtrInput
                id="invite-emails"
                type="email"
                autoComplete="off"
                placeholder={emails.length ? "" : t.dialog.emailsPlaceholder}
                value={draft}
                onChange={(e) => { setDraft(e.target.value); setError(null); }}
                onKeyDown={(e) => {
                  if ((e.key === "Enter" || e.key === ",") && draft.trim()) { e.preventDefault(); commit(draft); }
                  if (e.key === "Backspace" && !draft && emails.length) setEmails((l) => l.slice(0, -1));
                }}
                onBlur={() => draft.trim() && commit(draft)}
                aria-describedby="invite-emails-help"
                aria-invalid={!!error}
                className="h-8 min-w-40 flex-1 border-0 bg-transparent px-1.5 focus-visible:outline-0"
              />
            </div>
            <p id="invite-emails-help" className="text-small text-muted">{t.dialog.emailsHelp}</p>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="invite-role">{t.dialog.role}</Label>
            <NativeSelect id="invite-role" value={role} onChange={(e) => { setRole(e.target.value as MemberRole); setError(null); }}>
              {(["admin", "editor", "viewer"] as const).map((r) => (
                <option key={r} value={r}>{ROLE_LABEL[r]} · {ROLE_DESCRIPTION[r]}</option>
              ))}
            </NativeSelect>
            {full && role !== "viewer" && <p className="text-small text-text-2">{seatsCopy}</p>}
          </div>
          {error && <p role="alert" className="text-small text-danger">{error}</p>}
          <div className="flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>{accountCommon.cancel}</Button>
            <Button type="submit" loading={sending}>{sending ? t.dialog.sending : t.dialog.send}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
