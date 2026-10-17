import * as React from "react";
import Link from "next/link";
import { BRAND } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { LTR_VARS, PENDING_MARKER_HE, resolveOwnerVar } from "./owner-vars";

/**
 * Inline mini-markdown for long-form Hebrew content (legal, blog, FAQ answers).
 * Supported: **bold**, [label](href), {{OWNER_VAR}}, <ltr>…</ltr>, `code`, bare e-mail addresses.
 * mode "legal": an unfilled owner variable renders a visible "[יושלם לפני ההשקה]" marker.
 * mode "site": an unfilled owner variable renders nothing (callers avoid such sentences).
 */
export type InlineMode = "legal" | "site";

const TOKEN =
  /\*\*(.+?)\*\*|\[([^\]]+)\]\(([^)\s]+)\)|\{\{([A-Z0-9_]+)\}\}|<ltr>(.+?)<\/ltr>|`([^`]+)`|([A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,})/g;

/** "hello@{{DOMAIN}}" becomes a real address before tokenizing, so it is detected as an e-mail. */
function preSubstitute(text: string) {
  return text.replace(/@\{\{DOMAIN\}\}/g, `@${BRAND.domain}`);
}

export function PendingVar({ name }: { name: string }) {
  return (
    <span
      data-owner-var={name}
      title={`ערך שהבעלים ימלאו: ${name}`}
      className="mx-0.5 inline-block rounded-xs border border-dashed border-primary-text/70 bg-primary/10 px-1.5 text-[0.85em] font-semibold leading-snug text-primary-text"
    >
      {PENDING_MARKER_HE}
    </span>
  );
}

function renderLink(label: React.ReactNode, href: string, key: string) {
  const cls = "text-link underline decoration-1 underline-offset-[0.22em] hover:decoration-2";
  if (href.startsWith("/")) {
    return (
      <Link key={key} href={href} className={cls}>
        {label}
      </Link>
    );
  }
  if (href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) {
    return (
      <a key={key} href={href} className={cls}>
        {label}
      </a>
    );
  }
  return (
    <a key={key} href={href} target="_blank" rel="noopener nofollow" className={cls}>
      {label}
      <span className="sr-only"> (נפתח בלשונית חדשה)</span>
    </a>
  );
}

export function renderInline(text: string, mode: InlineMode = "legal", keyPrefix = "i"): React.ReactNode[] {
  const src = preSubstitute(text);
  const out: React.ReactNode[] = [];
  let last = 0;
  let n = 0;
  TOKEN.lastIndex = 0;
  for (const m of src.matchAll(TOKEN)) {
    const at = m.index ?? 0;
    if (at > last) out.push(src.slice(last, at));
    const key = `${keyPrefix}-${n++}`;
    const [, bold, linkLabel, linkHref, varName, ltr, code, email] = m;
    if (bold !== undefined) {
      out.push(<strong key={key}>{renderInline(bold, mode, key)}</strong>);
    } else if (linkLabel !== undefined && linkHref !== undefined) {
      out.push(renderLink(renderInline(linkLabel, mode, key), linkHref, key));
    } else if (varName !== undefined) {
      const value = resolveOwnerVar(varName);
      if (value === null) {
        if (mode === "legal") out.push(<PendingVar key={key} name={varName} />);
      } else if (LTR_VARS.has(varName)) {
        out.push(<bdi key={key} dir="ltr">{value}</bdi>);
      } else {
        out.push(value);
      }
    } else if (ltr !== undefined) {
      out.push(<bdi key={key} dir="ltr">{ltr}</bdi>);
    } else if (code !== undefined) {
      out.push(<code key={key}>{code}</code>);
    } else if (email !== undefined) {
      out.push(
        <a key={key} href={`mailto:${email}`} className="text-link underline decoration-1 underline-offset-[0.22em] hover:decoration-2">
          <bdi dir="ltr">{email}</bdi>
        </a>,
      );
    }
    last = at + m[0].length;
  }
  if (last < src.length) out.push(src.slice(last));
  return out;
}

export function Inline({ text, mode = "legal", className, as: As = "span" }: { text: string; mode?: InlineMode; className?: string; as?: "span" | "p" | "strong" }) {
  return <As className={cn(className)}>{renderInline(text, mode)}</As>;
}

/** Plain text (for JSON-LD, word counts and search): strips markup and resolves filled variables. */
export function plainText(text: string): string {
  return preSubstitute(text)
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/\[([^\]]+)\]\([^)\s]+\)/g, "$1")
    .replace(/<\/?ltr>/g, "")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\{\{([A-Z0-9_]+)\}\}/g, (_, k: string) => resolveOwnerVar(k) ?? "");
}
