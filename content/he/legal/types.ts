import type { ContactTopic } from "@/content/he/site";

export type LegalSlug = "terms" | "privacy" | "cookies" | "cancellation" | "accessibility" | "ai-policy" | "likeness-consent" | "dpa";

/**
 * A legal document (Part 02 §10.1 frontmatter + body). `body` is mini-markdown
 * (components/marketing/content/markdown.ts): "## Title {#anchor}" per numbered chapter.
 * Owner variables stay as {{NAME}} tokens and are resolved from BRAND at render time.
 * Developer notes (⚖️, [M0-verify], "חלק 0X") are never part of the displayed text.
 */
export interface LegalDoc {
  slug: LegalSlug;
  title: string;
  /** Short label for the legal hub and cross-links. */
  shortTitle: string;
  description: string;
  icon: "scale" | "shield" | "cookie" | "undo" | "a11y" | "sparkles" | "user-check" | "handshake";
  /** YYYY-MM-DD — also the consent version (Part 04 §21.4). */
  version: string;
  /** YYYY-MM-DD of the last edit. */
  updated: string;
  reviewStatus: "draft" | "approved";
  material: boolean;
  summary: string[];
  body: string;
  contact: { email: "hello" | "privacy" | "billing" | "accessibility" | "abuse"; topic: ContactTopic };
}
