"use client";
import * as React from "react";
import { toast } from "sonner";
import { Check, Lock, MessageCircle, Mail, Smartphone, Clapperboard, Megaphone, CreditCard } from "lucide-react";
import { Switch } from "@/components/ui/misc";
import { Button } from "@/components/ui/button";
import { LtrInput } from "@/components/ui/input";
import { Field } from "@/components/ui/label";
import { Tooltip } from "@/components/ui/tooltip";
import { Checkbox, SavedIndicator, useAutosave } from "./controls";
import { Panel, Section, Note } from "./kit";
import { settingsCopy } from "@/content/he/account";
import { MOCK_FLAGS, MOCK_NOTIFICATION_PREFS, MOCK_CONSENTS, type NotificationKind } from "@/lib/mock/account";
import { fill } from "./format";
import { cn } from "./cn";

const c = settingsCopy.notifications;

const GROUPS: { id: keyof typeof c.groups; icon: typeof Mail; kinds: NotificationKind[] }[] = [
  { id: "videos", icon: Clapperboard, kinds: ["job_succeeded", "job_failed", "approval_received"] },
  { id: "campaigns", icon: Megaphone, kinds: ["lead_received", "meta_campaign_live", "meta_ad_rejected", "weekly_results", "spend_cap_warning", "social_post_published", "social_post_failed"] },
  { id: "account", icon: CreditCard, kinds: ["credits_low", "meta_connection_lost", "payment_failed", "invite"] },
];
const LOCKED = new Set<NotificationKind>(["payment_failed", "meta_connection_lost", "invite"]);

type Prefs = Record<NotificationKind, { email: boolean; whatsapp: boolean }>;
function initialPrefs(): Prefs {
  const all = GROUPS.flatMap((g) => g.kinds);
  return Object.fromEntries(all.map((k) => [k, MOCK_NOTIFICATION_PREFS[k] ?? { email: true, whatsapp: true }])) as Prefs;
}

const isPhone = (s: string) => /^0(5\d|[2-489]|7\d)-?\d{3}-?\d{4}$/.test(s.replace(/\s/g, "")) || /^0(5\d|[2-489]|7\d)\d{7}$/.test(s.replace(/[\s-]/g, ""));

export function NotificationsSettings() {
  const save = useAutosave(400);
  const [prefs, setPrefs] = React.useState<Prefs>(initialPrefs);
  const [marketing, setMarketing] = React.useState(MOCK_CONSENTS.find((x) => x.kind === "marketing_email")?.granted ?? false);
  // WhatsApp verification (mock of /api/account/whatsapp/*)
  const [wa, setWa] = React.useState<"idle" | "code" | "verified">("idle");
  const [phone, setPhone] = React.useState("");
  const [consent, setConsent] = React.useState(false);
  const [code, setCode] = React.useState("");
  const [waError, setWaError] = React.useState<string | null>(null);
  const showWa = MOCK_FLAGS.whatsapp_notify && wa === "verified";

  const set = (k: NotificationKind, ch: "email" | "whatsapp", v: boolean) => {
    setPrefs((p) => ({ ...p, [k]: { ...p[k], [ch]: v } }));
    save.touch();
  };

  return (
    <div className="flex flex-col gap-10">
      <Section id="kinds" title={c.title} description={c.subtitle} actions={<SavedIndicator state={save.state} />}>
        <Panel className="p-0 md:p-0">
          <div role="table" aria-label={c.title} className="flex flex-col">
            <div role="rowgroup" className="hidden md:block">
              <div role="row" className={cn("grid items-center gap-4 border-b border-border px-6 py-3 text-micro text-muted", showWa ? "grid-cols-[1fr_110px_90px_90px]" : "grid-cols-[1fr_110px_90px]")}>
                <span role="columnheader">{c.columns.kind}</span>
                <span role="columnheader" className="text-center">{c.columns.inApp}</span>
                <span role="columnheader" className="text-center">{c.columns.email}</span>
                {showWa && <span role="columnheader" className="text-center">{c.columns.whatsapp}</span>}
              </div>
            </div>
            {GROUPS.map((g) => (
              <div key={g.id} role="rowgroup" className="border-b border-border last:border-b-0">
                <div role="row" className="flex items-center gap-2 bg-surface-2/40 px-5 py-2.5 md:px-6">
                  <g.icon className="size-4 text-primary-text" aria-hidden />
                  <span role="rowheader" className="text-sm font-bold">{c.groups[g.id]}</span>
                </div>
                {g.kinds.map((k) => {
                  const locked = LOCKED.has(k);
                  const label = c.kinds[k];
                  const hint = (c.hints as Record<string, string>)[k];
                  return (
                    <div
                      key={k}
                      role="row"
                      className={cn(
                        "grid items-center gap-x-4 gap-y-2 px-5 py-3.5 md:px-6",
                        showWa ? "grid-cols-[1fr_auto_auto] md:grid-cols-[1fr_110px_90px_90px]" : "grid-cols-[1fr_auto] md:grid-cols-[1fr_110px_90px]",
                      )}
                    >
                      <div role="cell" className="flex flex-col">
                        <span className="font-semibold">{label}</span>
                        {hint && <span className="text-small text-text-2">{hint}</span>}
                        {locked && <span className="text-small text-text-2">{(c.locked as Record<string, string>)[k]}</span>}
                      </div>
                      <div role="cell" className="hidden justify-center md:flex">
                        <span className="inline-flex items-center gap-1 text-micro text-success">
                          <Check className="size-3.5" aria-hidden />
                          {c.alwaysOn}
                        </span>
                      </div>
                      <div role="cell" className="flex items-center justify-center gap-2">
                        <Mail className="size-4 text-muted md:hidden" aria-hidden />
                        {locked ? (
                          <Tooltip content={(c.locked as Record<string, string>)[k]}>
                            <span tabIndex={0} className="inline-flex h-6 w-11 items-center justify-center rounded-full bg-surface-3 text-text-2" aria-label={`${fill(c.toggleSr, { channel: c.columns.email, kind: label })}: ${c.alwaysOn}`}>
                              <Lock className="size-3.5" aria-hidden />
                            </span>
                          </Tooltip>
                        ) : (
                          <Switch
                            checked={prefs[k].email}
                            onCheckedChange={(v) => set(k, "email", v)}
                            aria-label={fill(c.toggleSr, { channel: c.columns.email, kind: label })}
                          />
                        )}
                      </div>
                      {showWa && (
                        <div role="cell" className="flex items-center justify-center gap-2">
                          <MessageCircle className="size-4 text-muted md:hidden" aria-hidden />
                          {locked ? (
                            <span className="inline-flex h-6 w-11 items-center justify-center rounded-full bg-surface-3 text-text-2"><Lock className="size-3.5" aria-label={c.alwaysOn} /></span>
                          ) : (
                            <Switch
                              checked={prefs[k].whatsapp}
                              onCheckedChange={(v) => set(k, "whatsapp", v)}
                              aria-label={fill(c.toggleSr, { channel: c.columns.whatsapp, kind: label })}
                            />
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </Panel>
      </Section>

      {MOCK_FLAGS.whatsapp_notify && (
        <Section id="whatsapp" title={c.whatsapp.title}>
          <Panel className="flex flex-col gap-5">
            {wa === "verified" ? (
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <Note tone="success" icon={<Smartphone aria-hidden />} className="flex-1">
                  {c.whatsapp.verified.split("{phone}")[0]}
                  <bdi dir="ltr" className="num font-semibold">{phone}</bdi>
                  {c.whatsapp.verified.split("{phone}")[1]}
                </Note>
                <Button
                  variant="secondary"
                  onClick={() => { setWa("idle"); setCode(""); setConsent(false); toast(c.whatsapp.optedOut); }}
                >
                  {c.whatsapp.optOut}
                </Button>
              </div>
            ) : (
              <>
                <div className="grid gap-4 md:grid-cols-[minmax(0,320px)_1fr] md:items-end">
                  <Field label={c.whatsapp.phone} htmlFor="wa-phone" error={waError && wa === "idle" ? waError : undefined}>
                    <LtrInput
                      id="wa-phone"
                      type="tel"
                      inputMode="tel"
                      autoComplete="tel"
                      placeholder="050-1234567"
                      value={phone}
                      disabled={wa === "code"}
                      aria-invalid={!!waError && wa === "idle"}
                      onChange={(e) => { setPhone(e.target.value); setWaError(null); }}
                    />
                  </Field>
                </div>
                <Checkbox id="wa-consent" checked={consent} onCheckedChange={setConsent} disabled={wa === "code"}>
                  {c.whatsapp.consent.split("{phone}")[0]}
                  <bdi dir="ltr" className="num font-semibold">{phone || "050-1234567"}</bdi>
                  {c.whatsapp.consent.split("{phone}")[1]}
                </Checkbox>
                {wa === "idle" && (
                  <Button
                    className="w-fit"
                    variant="secondary"
                    onClick={() => {
                      if (!isPhone(phone)) { setWaError(c.whatsapp.phoneError); return; }
                      if (!consent) { setWaError(c.whatsapp.consentRequired); return; }
                      setWaError(null);
                      setWa("code");
                      toast.success(fill(c.whatsapp.codeSent, { phone }));
                    }}
                  >
                    <MessageCircle aria-hidden />
                    {c.whatsapp.sendCode}
                  </Button>
                )}
                {wa === "idle" && waError === c.whatsapp.consentRequired && <p role="alert" className="text-small text-danger">{waError}</p>}
                {wa === "code" && (
                  <form
                    className="flex flex-col gap-3 sm:flex-row sm:items-end"
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (!/^\d{6}$/.test(code) || code === "000000") { setWaError(c.whatsapp.codeError); return; }
                      setWaError(null);
                      setWa("verified");
                    }}
                  >
                    <div className="sm:w-56">
                      <Field label={c.whatsapp.code} htmlFor="wa-code" error={waError ?? undefined}>
                        <LtrInput id="wa-code" inputMode="numeric" autoComplete="one-time-code" maxLength={6} value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))} aria-invalid={!!waError} className="text-center tracking-[0.3em]" />
                      </Field>
                    </div>
                    <Button type="submit" className="w-fit">{c.whatsapp.verify}</Button>
                  </form>
                )}
              </>
            )}
          </Panel>
        </Section>
      )}

      <Section id="marketing" title={c.marketingTitle}>
        <Panel>
          <Checkbox
            id="marketing-consent"
            checked={marketing}
            onCheckedChange={(v) => { setMarketing(v); save.touch(); }}
          >
            {c.marketing}
          </Checkbox>
        </Panel>
      </Section>
    </div>
  );
}
