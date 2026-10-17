"use client";
import * as React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CircleCheck, Send } from "lucide-react";
import { toast } from "sonner";
import { Button, buttonVariants } from "@/components/ui/button";
import { Field } from "@/components/ui/label";
import { Input, LtrInput, Textarea } from "@/components/ui/input";
import { BRAND } from "@/lib/constants";
import { isFilled } from "@/lib/hebrew/text";
import { cn } from "@/lib/utils";
import { CONTACT, CONTACT_TOPICS, type ContactTopic } from "@/content/he/site";
import { renderInline } from "./inline";

type Fields = { name: string; email: string; phone: string; topic: ContactTopic | ""; message: string; marketingOptIn: boolean; website: string };
type Errors = Partial<Record<"name" | "email" | "phone" | "topic" | "message", string>>;

const MAX = 5000;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const ORDER: (keyof Errors)[] = ["name", "email", "phone", "topic", "message"];

function validate(f: Fields): Errors {
  const e: Errors = {};
  const name = f.name.trim();
  if (name.length < 2 || name.length > 80) e.name = CONTACT.errors.name;
  const email = f.email.trim();
  if (!email) e.email = CONTACT.errors.emailEmpty;
  else if (!EMAIL.test(email)) e.email = CONTACT.errors.emailInvalid;
  const phone = f.phone.replace(/[\s()-]/g, "");
  if (phone && !/^(?:\+?972|0)\d{8,9}$/.test(phone)) e.phone = CONTACT.errors.phone;
  if (!f.topic) e.topic = CONTACT.errors.topic;
  const msg = f.message.trim();
  if (msg.length < 10) e.message = CONTACT.errors.messageShort;
  else if (msg.length > MAX) e.message = CONTACT.errors.messageLong;
  return e;
}

function isTopic(v: string | null): v is ContactTopic {
  return !!v && CONTACT_TOPICS.some((t) => t.value === v);
}

function a11yHelp() {
  const parts = [BRAND.a11y.coordinatorTitle, BRAND.a11y.coordinatorName, BRAND.a11y.coordinatorPhone, BRAND.a11y.coordinatorEmail].filter((v) => isFilled(v));
  return `${CONTACT.topicHelp.accessibilityPrefix}${parts.length ? `: ${parts.join(", ")}` : ""}. ${CONTACT.topicHelp.accessibilitySuffix}`;
}

function ErrorText({ id, text }: { id: string; text?: string }) {
  if (!text) return null;
  return (
    <p id={id} className="text-small text-danger">
      {renderInline(text, "site", id)}
    </p>
  );
}

const describedBy = (...ids: (string | false | undefined)[]) => ids.filter(Boolean).join(" ") || undefined;

/** ContactForm (Part 02 §9.2). Not connected to a backend during the UI pass — the success state says so. */
export function ContactForm() {
  const params = useSearchParams();
  const initialTopic = params.get("topic");
  const [f, setF] = React.useState<Fields>({
    name: "",
    email: "",
    phone: "",
    topic: isTopic(initialTopic) ? initialTopic : "",
    message: "",
    marketingOptIn: false,
    website: "",
  });
  const [errors, setErrors] = React.useState<Errors>({});
  const [submitted, setSubmitted] = React.useState(false);
  const [sending, setSending] = React.useState(false);
  const [done, setDone] = React.useState<string | null>(null);
  const successRef = React.useRef<HTMLHeadingElement>(null);
  const focusField = (k: keyof Errors) => document.getElementById(`c-${k}`)?.focus();

  const set = <K extends keyof Fields>(k: K, v: Fields[K]) => {
    const next = { ...f, [k]: v };
    setF(next);
    if (submitted) setErrors(validate(next));
  };

  React.useEffect(() => {
    if (done) successRef.current?.focus();
  }, [done]);

  const onSubmit = (ev: React.FormEvent) => {
    ev.preventDefault();
    setSubmitted(true);
    const e = validate(f);
    setErrors(e);
    const first = ORDER.find((k) => e[k]);
    if (first) {
      focusField(first);
      return;
    }
    if (f.website) {
      setDone(f.email.trim()); // honeypot: silently "succeed"
      return;
    }
    setSending(true);
    window.setTimeout(() => {
      setSending(false);
      setDone(f.email.trim());
      toast.info(CONTACT.demoToast, { description: CONTACT.demoToastBody });
    }, 900);
  };

  if (done) {
    return (
      <div className="flex flex-col items-start gap-4 py-4">
        <span aria-hidden className="inline-flex size-14 items-center justify-center rounded-full bg-success/15 text-success">
          <CircleCheck className="size-7" />
        </span>
        <h2 ref={successRef} tabIndex={-1} className="text-h2 outline-none">
          {CONTACT.successTitle}
        </h2>
        <p className="text-body-lg text-text-2">{CONTACT.successBody(done)}</p>
        <p role="note" className="rounded-md border border-dashed border-border-strong bg-surface-2/60 px-4 py-3 text-small text-text-2">
          {renderInline(CONTACT.demoNote, "site", "demo")}
        </p>
        <div className="flex flex-wrap gap-2">
          <Link href="/faq" className={cn(buttonVariants({ size: "lg" }))}>
            {CONTACT.successFaq}
          </Link>
          <Button
            variant="ghost"
            size="lg"
            onClick={() => {
              setDone(null);
              setSubmitted(false);
              setErrors({});
              setF((p) => ({ ...p, message: "" }));
            }}
          >
            {CONTACT.sendAnother}
          </Button>
        </div>
      </div>
    );
  }

  const count = Object.keys(errors).length;
  const help =
    f.topic === "cancellation" ? CONTACT.topicHelp.cancellation : f.topic === "accessibility" ? a11yHelp() : f.topic === "privacy" ? CONTACT.topicHelp.privacy : "";
  const selectCls =
    "h-11 w-full appearance-none rounded-sm border border-border-strong bg-surface-2 ps-3.5 pe-10 text-base text-text focus-visible:outline-2 focus-visible:outline-offset-0 aria-[invalid=true]:border-danger";

  return (
    <form noValidate onSubmit={onSubmit} aria-describedby="contact-privacy" className="flex flex-col gap-5">
      {submitted && count > 0 && (
        <p role="alert" className="rounded-md border border-danger/50 bg-danger/10 px-4 py-3 text-small font-semibold text-danger">
          {CONTACT.errors.summary(count)}
        </p>
      )}
      <div className="grid gap-5 md:grid-cols-2">
        <Field label={CONTACT.fields.name} htmlFor="c-name">
          <Input
            id="c-name"
            name="name"
            autoComplete="name"
            maxLength={80}
            value={f.name}
            onChange={(e) => set("name", e.target.value)}
            aria-invalid={!!errors.name || undefined}
            aria-describedby={describedBy(errors.name && "c-name-err")}
          />
          <ErrorText id="c-name-err" text={errors.name} />
        </Field>
        <Field label={CONTACT.fields.email} htmlFor="c-email">
          <LtrInput
            id="c-email"
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            value={f.email}
            onChange={(e) => set("email", e.target.value)}
            aria-invalid={!!errors.email || undefined}
            aria-describedby={describedBy(errors.email && "c-email-err")}
          />
          <ErrorText id="c-email-err" text={errors.email} />
        </Field>
        <Field label={CONTACT.fields.phone} htmlFor="c-phone" optional>
          <LtrInput
            id="c-phone"
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            value={f.phone}
            onChange={(e) => set("phone", e.target.value)}
            aria-invalid={!!errors.phone || undefined}
            aria-describedby={describedBy(errors.phone && "c-phone-err")}
          />
          <ErrorText id="c-phone-err" text={errors.phone} />
        </Field>
        <Field label={CONTACT.fields.topic} htmlFor="c-topic">
          <div className="relative">
            <select
              id="c-topic"
              name="topic"
              value={f.topic}
              onChange={(e) => set("topic", e.target.value as ContactTopic | "")}
              aria-invalid={!!errors.topic || undefined}
              aria-describedby={describedBy(errors.topic && "c-topic-err", help && "c-topic-help")}
              className={cn(selectCls, !f.topic && "text-muted")}
            >
              <option value="" disabled>
                {CONTACT.fields.topicPlaceholder}
              </option>
              {CONTACT_TOPICS.map((t) => (
                <option key={t.value} value={t.value} className="text-text">
                  {t.label}
                </option>
              ))}
            </select>
            <svg aria-hidden viewBox="0 0 24 24" className="pointer-events-none absolute inset-e-3 top-1/2 size-4 -translate-y-1/2 text-text-2" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="m6 9 6 6 6-6" />
            </svg>
          </div>
          <ErrorText id="c-topic-err" text={errors.topic} />
        </Field>
      </div>

      <div aria-live="polite">
        {help && (
          <p id="c-topic-help" className="rounded-md bg-surface-2 px-4 py-3 text-small text-text-2 shadow-[inset_0_0_0_1px_var(--color-frame)]">
            {renderInline(help, "site", "topichelp")}
          </p>
        )}
      </div>

      <Field label={CONTACT.fields.message} htmlFor="c-message">
        <Textarea
          id="c-message"
          name="message"
          rows={6}
          value={f.message}
          onChange={(e) => set("message", e.target.value)}
          aria-invalid={!!errors.message || undefined}
          aria-describedby={describedBy(errors.message && "c-message-err", "c-message-count")}
          className="min-h-36"
        />
        <div className="flex items-start justify-between gap-3">
          <ErrorText id="c-message-err" text={errors.message} />
          <p id="c-message-count" className={cn("ms-auto shrink-0 text-micro font-normal text-muted", f.message.length > MAX && "text-danger")}>
            {CONTACT.counter(f.message.length, MAX)}
          </p>
        </div>
      </Field>

      {/* honeypot — hidden from everyone, including screen readers */}
      <div aria-hidden className="pointer-events-none absolute -z-10 h-0 w-0 overflow-hidden opacity-0">
        <label htmlFor="c-website">{CONTACT.fields.honeypot}</label>
        <input id="c-website" name="website" tabIndex={-1} autoComplete="off" value={f.website} onChange={(e) => set("website", e.target.value)} />
      </div>

      <label className="flex cursor-pointer items-start gap-3 text-small text-text-2">
        <input
          type="checkbox"
          name="marketingOptIn"
          checked={f.marketingOptIn}
          onChange={(e) => set("marketingOptIn", e.target.checked)}
          className="mt-1 size-4 shrink-0 accent-primary"
        />
        <span>{CONTACT.fields.marketing}</span>
      </label>

      <p id="contact-privacy" className="text-micro font-normal leading-relaxed text-muted">
        {renderInline(CONTACT.privacyNote, "site", "privacy")}
      </p>

      <div>
        <Button type="submit" size="lg" loading={sending} className="min-w-40">
          {!sending && <Send aria-hidden />}
          {sending ? CONTACT.submitting : CONTACT.submit}
        </Button>
      </div>
    </form>
  );
}
