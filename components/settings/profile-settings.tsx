"use client";
import * as React from "react";
import { toast } from "sonner";
import { Mail } from "lucide-react";
import { Input, LtrInput } from "@/components/ui/input";
import { Field, Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/misc";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { RadioCards, SavedIndicator, useAutosave, NativeSelect } from "./controls";
import { Panel, Section, Note } from "./kit";
import { ThemeSegmented } from "./display-controls";
import { settingsCopy as c, accountCommon } from "@/content/he/account";
import { MOCK_PROFILE, MOCK_WORKSPACE, MOCK_MEMBERS, type GenderForm } from "@/lib/mock/account";
import { niches } from "@/lib/data/seed";
import { fill, isEmail } from "./format";

export function ProfileSettings() {
  const save = useAutosave();
  const [fullName, setFullName] = React.useState(MOCK_PROFILE.fullName);
  const [gender, setGender] = React.useState<GenderForm>(MOCK_PROFILE.genderForm);
  const [emailOpen, setEmailOpen] = React.useState(false);
  const [newEmail, setNewEmail] = React.useState("");
  const [emailErr, setEmailErr] = React.useState<string | null>(null);
  const [emailSent, setEmailSent] = React.useState(false);

  return (
    <div className="flex flex-col gap-10">
      <Section id="profile" title={c.profile.title} actions={<SavedIndicator state={save.state} />}>
        <Panel className="flex flex-col gap-6">
          <div className="flex items-center gap-4">
            <Avatar name={fullName || MOCK_PROFILE.fullName} className="size-16 text-xl" />
            <div className="flex flex-col">
              <span className="text-body-lg font-bold" dir="auto">{fullName}</span>
              <span className="text-small text-text-2">{c.profile.avatarNote}</span>
            </div>
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            <Field label={c.profile.fullName} htmlFor="full-name">
              <Input
                id="full-name"
                dir="auto"
                value={fullName}
                autoComplete="name"
                onChange={(e) => { setFullName(e.target.value); save.touch(); }}
              />
            </Field>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="email">{c.profile.email}</Label>
              <div className="flex gap-2">
                <LtrInput id="email" readOnly value={MOCK_PROFILE.email} className="flex-1" />
                <Button variant="secondary" size="lg" className="h-11" onClick={() => { setEmailOpen(true); setEmailSent(false); setNewEmail(""); setEmailErr(null); }}>
                  {c.profile.changeEmail}
                </Button>
              </div>
            </div>
          </div>
        </Panel>
      </Section>

      <Section id="address" title={c.profile.address} description={c.profile.addressHelp}>
        <Panel className="flex flex-col gap-5">
          <RadioCards<GenderForm>
            label={c.profile.address}
            value={gender}
            onValueChange={(v) => { setGender(v); save.touch(); }}
            columns={3}
            options={(["plural", "female", "male"] as const).map((v) => ({ value: v, label: c.profile.addressOptions[v] }))}
          />
          <div className="rounded-md bg-bg p-4 shadow-[inset_0_0_0_1px_var(--color-frame)]" aria-live="polite">
            <p className="text-micro text-muted">{c.profile.addressPreviewLabel}</p>
            <p className="mt-1 text-h3">{c.profile.addressPreview[gender]}</p>
          </div>
        </Panel>
      </Section>

      <Section id="theme" title={<span id="theme-label">{c.profile.theme}</span>}>
        <Panel>
          <ThemeSegmented id="theme" />
        </Panel>
      </Section>

      <WorkspaceSettings />

      <Dialog open={emailOpen} onOpenChange={setEmailOpen}>
        <DialogContent>
          <DialogTitle>{c.profile.changeEmail}</DialogTitle>
          {emailSent ? (
            <div className="mt-4 flex flex-col gap-4">
              <Note tone="success" icon={<Mail aria-hidden />}>{c.profile.emailSent}</Note>
              <Button variant="secondary" onClick={() => setEmailOpen(false)} className="self-end">{accountCommon.close}</Button>
            </div>
          ) : (
            <form
              className="mt-4 flex flex-col gap-4"
              onSubmit={(e) => {
                e.preventDefault();
                if (!isEmail(newEmail)) { setEmailErr(c.profile.emailInvalid); return; }
                setEmailErr(null);
                setEmailSent(true);
              }}
            >
              <DialogDescription className="sr-only">{c.profile.changeEmail}</DialogDescription>
              <Field label={c.profile.newEmail} htmlFor="new-email" error={emailErr ?? undefined}>
                <LtrInput id="new-email" type="email" autoComplete="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} aria-invalid={!!emailErr} aria-describedby={emailErr ? "new-email-error" : undefined} />
              </Field>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="ghost" onClick={() => setEmailOpen(false)}>{accountCommon.cancel}</Button>
                <Button type="submit">{c.profile.sendLink}</Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function WorkspaceSettings() {
  const save = useAutosave();
  const [name, setName] = React.useState(MOCK_WORKSPACE.name);
  const [niche, setNiche] = React.useState(MOCK_WORKSPACE.nicheSlug);
  const admins = MOCK_MEMBERS.filter((m) => m.role === "admin");
  const [transferTo, setTransferTo] = React.useState(admins[0]?.id ?? "");
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const target = admins.find((a) => a.id === transferTo);

  return (
    <Section id="workspace" title={c.workspace.title} actions={<SavedIndicator state={save.state} />}>
      <Panel className="flex flex-col gap-6">
        <div className="grid gap-5 md:grid-cols-2">
          <Field label={c.workspace.name} htmlFor="ws-name" error={!name.trim() ? c.workspace.nameRequired : undefined}>
            <Input id="ws-name" dir="auto" maxLength={60} value={name} aria-invalid={!name.trim()} onChange={(e) => { setName(e.target.value); if (e.target.value.trim()) save.touch(); }} />
          </Field>
          <Field label={c.workspace.niche} htmlFor="ws-niche" help={c.workspace.nicheHelp}>
            <NativeSelect id="ws-niche" value={niche} aria-describedby="ws-niche-help" onChange={(e) => { setNiche(e.target.value); save.touch(); }}>
              {niches.filter((n) => n.slug !== "local-politics").map((n) => (
                <option key={n.slug} value={n.slug}>{n.name_he}</option>
              ))}
            </NativeSelect>
          </Field>
        </div>

        <div className="flex flex-col gap-3 border-t border-border pt-6">
          <h3 className="text-body-lg font-bold">{c.workspace.transfer}</h3>
          {admins.length ? (
            <>
              <p className="text-small text-text-2">{c.workspace.transferHelp}</p>
              <div className="flex flex-col gap-2 sm:flex-row">
                <NativeSelect aria-label={c.workspace.transferSelect} value={transferTo} onChange={(e) => setTransferTo(e.target.value)} className="sm:w-72">
                  {admins.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
                </NativeSelect>
                <Button variant="secondary" size="lg" className="h-11" onClick={() => setConfirmOpen(true)}>{c.workspace.transferButton}</Button>
              </div>
            </>
          ) : (
            <Note>{c.workspace.transferNoAdmins}</Note>
          )}
        </div>
      </Panel>

      <Panel tone="danger" className="flex flex-col gap-3">
        <h3 className="text-body-lg font-bold text-danger">{c.workspace.deleteTitle}</h3>
        <p className="text-small text-text-2">{c.workspace.deleteBody}</p>
        <a href="/contact?topic=privacy" className="w-fit text-sm font-semibold text-link underline underline-offset-4">{c.workspace.deleteCta}</a>
      </Panel>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <DialogTitle>{fill(c.workspace.transferTitle, { workspace: name, name: target?.name ?? "" })}</DialogTitle>
          <DialogDescription>{fill(c.workspace.transferBody, { name: target?.name ?? "" })}</DialogDescription>
          <div className="mt-6 flex flex-wrap justify-end gap-2">
            <Button variant="secondary" onClick={() => setConfirmOpen(false)}>{accountCommon.cancel}</Button>
            <Button
              onClick={() => {
                setConfirmOpen(false);
                toast.success(fill(c.workspace.transferDone, { name: target?.name ?? "" }));
              }}
            >
              {c.workspace.transferButton}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Section>
  );
}
