"use client";
import * as React from "react";
import { toast } from "sonner";
import { Input, LtrInput } from "@/components/ui/input";
import { Field } from "@/components/ui/label";
import { Switch } from "@/components/ui/misc";
import { Button } from "@/components/ui/button";
import { Note } from "@/components/settings/kit";
import { billingCopy, accountCommon } from "@/content/he/account";
import { ALLOCATION_THRESHOLD_ILS, MOCK_BILLING_PROFILE } from "@/lib/mock/account";
import { fill, formatIls, isEmail, isValidIsraeliId } from "@/components/settings/format";

const p = billingCopy.profile;

/** BillingProfileForm (Part 03 §15.1; Server Action saveBillingProfile later). */
export function BillingProfileForm() {
  const [v, setV] = React.useState(MOCK_BILLING_PROFILE);
  const [errors, setErrors] = React.useState<Partial<Record<keyof typeof v, string>>>({});
  const [saving, setSaving] = React.useState(false);
  const set = <K extends keyof typeof v>(k: K, val: (typeof v)[K]) => setV((x) => ({ ...x, [k]: val }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const err: typeof errors = {};
    if (!v.legalName.trim()) err.legalName = p.errors.legalName;
    if (!isEmail(v.email)) err.email = p.errors.email;
    if (v.isBusiness && !v.vatId.trim()) err.vatId = p.errors.vatIdRequired;
    else if (v.vatId.trim() && !isValidIsraeliId(v.vatId)) err.vatId = p.errors.vatId;
    setErrors(err);
    if (Object.keys(err).length) return;
    setSaving(true);
    setTimeout(() => { setSaving(false); toast.success(accountCommon.saved); }, 600);
  };

  const errProps = (k: keyof typeof v) => ({ "aria-invalid": !!errors[k] || undefined, "aria-describedby": errors[k] ? `bp-${k}-error` : undefined });

  return (
    <form onSubmit={submit} noValidate className="flex flex-col gap-5">
      <div className="grid gap-5 md:grid-cols-2">
        <Field label={p.legalName} htmlFor="bp-legalName" error={errors.legalName}>
          <Input id="bp-legalName" dir="auto" value={v.legalName} onChange={(e) => set("legalName", e.target.value)} autoComplete="name" {...errProps("legalName")} />
        </Field>
        <Field label={p.email} htmlFor="bp-email" error={errors.email}>
          <LtrInput id="bp-email" type="email" value={v.email} onChange={(e) => set("email", e.target.value)} autoComplete="email" {...errProps("email")} />
        </Field>
      </div>
      <label className="flex w-fit items-center gap-3 font-semibold">
        <Switch checked={v.isBusiness} onCheckedChange={(c) => set("isBusiness", c)} />
        {p.isBusiness}
      </label>
      <div className="grid gap-5 md:grid-cols-2">
        <Field label={v.isBusiness ? p.vatId : p.vatIdOptional} htmlFor="bp-vatId" error={errors.vatId}>
          <LtrInput id="bp-vatId" inputMode="numeric" value={v.vatId} onChange={(e) => set("vatId", e.target.value)} {...errProps("vatId")} />
        </Field>
        <Field label={p.phone} htmlFor="bp-phone" optional>
          <LtrInput id="bp-phone" type="tel" value={v.phone} onChange={(e) => set("phone", e.target.value)} autoComplete="tel" />
        </Field>
        <Field label={p.address} htmlFor="bp-address" optional>
          <Input id="bp-address" value={v.address} onChange={(e) => set("address", e.target.value)} autoComplete="street-address" />
        </Field>
        <div className="grid grid-cols-[1fr_120px] gap-3">
          <Field label={p.city} htmlFor="bp-city" optional>
            <Input id="bp-city" value={v.city} onChange={(e) => set("city", e.target.value)} autoComplete="address-level2" />
          </Field>
          <Field label={p.zip} htmlFor="bp-zip" optional>
            <LtrInput id="bp-zip" inputMode="numeric" value={v.zip} onChange={(e) => set("zip", e.target.value)} autoComplete="postal-code" />
          </Field>
        </div>
      </div>
      <Note>
        <p>{p.help}</p>
        {v.isBusiness && <p className="mt-1">{fill(p.businessHelp, { threshold: formatIls(ALLOCATION_THRESHOLD_ILS) })}</p>}
      </Note>
      <Button type="submit" className="w-fit" loading={saving}>{saving ? accountCommon.saving : accountCommon.save}</Button>
    </form>
  );
}
