"use client";
import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { CircleCheck, Info, MailCheck } from "lucide-react";
import { toast } from "sonner";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input, LtrInput } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DirIcon } from "@/components/a11y/dir-icon";
import { cn } from "@/lib/utils";
import { AUTH, CONTENT_UI } from "@/content/he/site";
import { renderInline } from "@/components/marketing/content/inline";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const ALLOWED = ["/app", "/approve", "/admin"];

/** `next` must be an internal path under an allowed prefix; anything else → /app (Part 03 §3.1). */
export function safeNext(raw: string | null): string {
  if (!raw || !raw.startsWith("/") || raw.startsWith("//") || raw.includes("\\")) return "/app";
  const path = raw.split(/[?#]/)[0];
  return ALLOWED.some((p) => path === p || path.startsWith(`${p}/`)) ? raw : "/app";
}

function destination(next: string) {
  const d = AUTH.destinations;
  if (next.startsWith("/app/create")) return d.create;
  if (next.startsWith("/app/billing/cancel")) return d.cancel;
  if (next.startsWith("/approve")) return d.approve;
  if (next.startsWith("/admin")) return d.admin;
  return d.app;
}

function GoogleMark() {
  // Google "G" — brand colours per Google's guidelines; never mirrored.
  return (
    <svg aria-hidden viewBox="0 0 48 48" className="size-5" style={{ transform: "none" }}>
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z" />
      <path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z" />
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z" />
    </svg>
  );
}

type Stage = "form" | "sent" | "google";

export function LoginForm() {
  const params = useSearchParams();
  const router = useRouter();
  const next = safeNext(params.get("next"));
  const invite = params.get("invite");
  const error = params.get("error");
  const prefill = params.get("email") ?? "";

  const [stage, setStage] = React.useState<Stage>("form");
  const [email, setEmail] = React.useState(prefill);
  const [emailError, setEmailError] = React.useState<string | null>(null);
  const [marketing, setMarketing] = React.useState(false);
  const [sending, setSending] = React.useState(false);
  const [googleLoading, setGoogleLoading] = React.useState(false);
  const [otp, setOtp] = React.useState("");
  const [otpError, setOtpError] = React.useState<string | null>(null);
  const [cooldown, setCooldown] = React.useState(0);
  const headingRef = React.useRef<HTMLHeadingElement>(null);

  React.useEffect(() => {
    if (cooldown <= 0) return;
    const t = window.setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => window.clearTimeout(t);
  }, [cooldown]);

  React.useEffect(() => {
    if (stage !== "form") headingRef.current?.focus();
  }, [stage]);

  const context =
    next.startsWith("/app/billing/cancel")
      ? AUTH.context.cancel
      : invite
        ? prefill
          ? AUTH.context.inviteWithEmail(prefill)
          : AUTH.context.invite
        : error === "expired"
          ? AUTH.context.expired
          : error === "oauth"
            ? AUTH.context.oauth
            : next.startsWith("/app/create")
              ? AUTH.context.create
              : null;

  const rememberMarketing = () => {
    try {
      if (marketing) sessionStorage.setItem("signup_marketing_v1", "1");
      else sessionStorage.removeItem("signup_marketing_v1");
    } catch {
      /* storage unavailable — consent is simply not carried over */
    }
  };

  const sendLink = (ev?: React.FormEvent) => {
    ev?.preventDefault();
    const v = email.trim();
    const err = !v ? AUTH.validation.empty : !EMAIL.test(v) ? AUTH.validation.invalid : null;
    setEmailError(err);
    if (err) {
      document.getElementById("login-email")?.focus();
      return;
    }
    rememberMarketing();
    setSending(true);
    window.setTimeout(() => {
      setSending(false);
      setStage("sent");
      setCooldown(60);
    }, 900);
  };

  const google = () => {
    rememberMarketing();
    setGoogleLoading(true);
    window.setTimeout(() => {
      setGoogleLoading(false);
      setStage("google");
    }, 800);
  };

  const submitOtp = (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!/^\d{6}$/.test(otp)) {
      setOtpError(AUTH.sent.otpError);
      return;
    }
    setOtpError(null);
    toast.success(AUTH.signedInToast);
    router.push(next);
  };

  if (stage === "google") {
    return (
      <div className="flex flex-col gap-5">
        <span aria-hidden className="inline-flex size-14 items-center justify-center rounded-full bg-success/15 text-success">
          <CircleCheck className="size-7" />
        </span>
        <h1 ref={headingRef} tabIndex={-1} className="text-h2 outline-none">
          {AUTH.googleDone.title}
        </h1>
        <p className="text-text-2">{AUTH.googleDone.body(destination(next))}</p>
        <Link href={next} className={cn(buttonVariants({ size: "lg" }), "w-full")}>
          {AUTH.googleDone.cta}
          <DirIcon name="forward" />
        </Link>
        <button type="button" onClick={() => setStage("form")} className="self-start text-small font-semibold text-text-2 underline-offset-4 hover:text-text hover:underline">
          {AUTH.sent.change}
        </button>
      </div>
    );
  }

  if (stage === "sent") {
    return (
      <div className="flex flex-col gap-5">
        <span aria-hidden className="inline-flex size-14 items-center justify-center rounded-full bg-primary/15 text-primary-text glow-primary">
          <MailCheck className="size-7" />
        </span>
        <h1 ref={headingRef} tabIndex={-1} className="text-h2 outline-none">
          {AUTH.sent.title}
          <span className="mt-1 block text-[0.72em] text-primary-text [overflow-wrap:anywhere]">
            <bdi dir="ltr">{email.trim()}</bdi>
          </span>
        </h1>
        <p className="text-body-lg text-text-2">{AUTH.sent.body}</p>

        <form onSubmit={submitOtp} noValidate className="flex flex-col gap-3 rounded-lg bg-surface-1 p-5 shadow-[inset_0_0_0_1px_var(--color-frame)]">
          <p className="text-small text-text-2">{AUTH.sent.otpIntro}</p>
          <Label htmlFor="otp">{AUTH.sent.otpLabel}</Label>
          <Input
            id="otp"
            dir="ltr"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={6}
            value={otp}
            onChange={(e) => {
              setOtp(e.target.value.replace(/\D/g, "").slice(0, 6));
              setOtpError(null);
            }}
            aria-invalid={!!otpError || undefined}
            aria-describedby={otpError ? "otp-error" : undefined}
            size="lg"
            className="text-center font-mono text-2xl tracking-[0.5em]"
          />
          {otpError && (
            <p id="otp-error" role="alert" className="text-small text-danger">
              {otpError}
            </p>
          )}
          <Button type="submit" size="lg" variant="secondary">
            {AUTH.sent.otpSubmit}
          </Button>
        </form>

        <p className="text-small text-muted">{AUTH.sent.spam}</p>
        <div className="flex flex-wrap items-center gap-3">
          <Button
            type="button"
            variant="outline"
            disabled={cooldown > 0}
            onClick={() => {
              setCooldown(60);
              toast.success(AUTH.sent.resent);
            }}
          >
            {cooldown > 0 ? AUTH.sent.resendIn(cooldown) : AUTH.sent.resend}
          </Button>
          <button type="button" onClick={() => setStage("form")} className="text-small font-semibold text-text-2 underline-offset-4 hover:text-text hover:underline">
            {AUTH.sent.change}
          </button>
        </div>
        <p role="note" className="flex items-start gap-2 rounded-md border border-dashed border-border-strong px-4 py-3 text-micro font-normal leading-relaxed text-muted">
          <Info aria-hidden className="mt-0.5 size-4 shrink-0" />
          {AUTH.sent.demo}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 ref={headingRef} tabIndex={-1} className="text-h2 outline-none">
          {AUTH.title}
        </h1>
        <p className="mt-3 text-text-2">{AUTH.subtitle}</p>
      </div>

      {context && (
        <p role="status" className="flex items-start gap-2.5 rounded-md border border-violet/40 bg-violet/10 px-4 py-3 text-small text-text">
          <Info aria-hidden className="mt-0.5 size-4 shrink-0 text-violet" />
          <span>{renderInline(context, "site", "ctx")}</span>
        </p>
      )}

      <Button type="button" variant="secondary" size="lg" loading={googleLoading} onClick={google} className="w-full">
        {!googleLoading && <GoogleMark />}
        {AUTH.google}
      </Button>

      <div className="flex items-center gap-3 text-small text-muted" aria-hidden>
        <span className="h-px flex-1 bg-border" />
        {AUTH.or}
        <span className="h-px flex-1 bg-border" />
      </div>

      <form onSubmit={sendLink} noValidate className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="login-email">{AUTH.emailLabel}</Label>
          <LtrInput
            id="login-email"
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder={AUTH.emailPlaceholder}
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (emailError) setEmailError(null);
            }}
            aria-invalid={!!emailError || undefined}
            aria-describedby={emailError ? "login-email-error" : undefined}
            size="lg"
          />
          {emailError && (
            <p id="login-email-error" role="alert" className="text-small text-danger">
              {emailError}
            </p>
          )}
        </div>
        <Button type="submit" size="lg" loading={sending} className="w-full">
          {sending ? AUTH.sending : AUTH.sendLink}
        </Button>
        <label className="flex cursor-pointer items-start gap-3 text-small text-text-2">
          <input type="checkbox" checked={marketing} onChange={(e) => setMarketing(e.target.checked)} className="mt-1 size-4 shrink-0 accent-primary" />
          <span>{AUTH.marketing}</span>
        </label>
      </form>

      <p className="text-micro font-normal leading-relaxed text-muted">
        {AUTH.consentPrefix}
        <a href="/legal/terms" target="_blank" rel="noopener" className="text-link underline underline-offset-2">
          {AUTH.terms}
          <span className="sr-only"> {CONTENT_UI.newTab}</span>
        </a>
        {AUTH.consentMiddle}
        <a href="/legal/privacy" target="_blank" rel="noopener" className="text-link underline underline-offset-2">
          {AUTH.privacy}
          <span className="sr-only"> {CONTENT_UI.newTab}</span>
        </a>
        {AUTH.consentSuffix}
      </p>
    </div>
  );
}
