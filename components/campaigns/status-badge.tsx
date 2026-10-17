import * as React from "react";
import { Check, CircleAlert, Clock, Pause, TriangleAlert, Circle, Archive } from "lucide-react";
import type { AdStatus, CampaignStatus } from "@/lib/mock/campaigns";
import { AD_STATUS_LABEL, STATUS_LABEL } from "@/content/he/campaigns-app";
import { cn } from "@/lib/utils";

/** StatusBadge kinds `campaign` and `ad` (Part 01 §10.10 tones): always icon + text, never color alone. */
type Tone = "neutral" | "progress" | "waiting" | "success" | "live" | "warning" | "danger";

const TONE_CLASS: Record<Tone, string> = {
  neutral: "bg-surface-3 text-text-2",
  progress: "bg-violet/15 text-violet",
  waiting: "bg-primary/12 text-primary-text",
  success: "bg-success/15 text-success",
  live: "bg-success/15 text-success",
  warning: "bg-primary/12 text-primary-text",
  danger: "bg-danger/15 text-danger",
};

function ToneIcon({ tone, paused, archived }: { tone: Tone; paused?: boolean; archived?: boolean }) {
  if (paused) return <Pause aria-hidden />;
  if (archived) return <Archive aria-hidden />;
  switch (tone) {
    case "live":
    case "progress":
      return <span aria-hidden className="size-1.5 rounded-full bg-current animate-pulse-dot" />;
    case "waiting":
      return <Clock aria-hidden />;
    case "success":
      return <Check aria-hidden />;
    case "warning":
      return <TriangleAlert aria-hidden />;
    case "danger":
      return <CircleAlert aria-hidden />;
    default:
      return <Circle aria-hidden />;
  }
}

const CAMPAIGN_TONE: Record<CampaignStatus, Tone> = {
  draft: "neutral",
  preparing: "progress",
  ready: "success",
  in_review: "waiting",
  active: "live",
  paused: "neutral",
  with_issues: "warning",
  rejected: "danger",
  completed: "neutral",
  error: "danger",
  archived: "neutral",
};

export function CampaignStatusBadge({ status, size = "md", className }: { status: CampaignStatus; size?: "sm" | "md"; className?: string }) {
  const tone = CAMPAIGN_TONE[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 whitespace-nowrap rounded-full font-semibold [&_svg]:size-3.5",
        size === "sm" ? "px-2 py-0.5 text-micro" : "px-2.5 py-1 text-xs",
        TONE_CLASS[tone],
        className,
      )}
    >
      <ToneIcon tone={tone} paused={status === "paused"} archived={status === "archived"} />
      {STATUS_LABEL[status]}
    </span>
  );
}

const AD_TONE: Record<AdStatus, Tone> = { active: "live", paused: "neutral", in_review: "waiting", rejected: "danger" };

export function AdStatusBadge({ status, className }: { status: AdStatus; className?: string }) {
  const tone = AD_TONE[status];
  return (
    <span className={cn("inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2 py-0.5 text-micro font-semibold [&_svg]:size-3", TONE_CLASS[tone], className)}>
      <ToneIcon tone={tone} paused={status === "paused"} />
      {AD_STATUS_LABEL[status]}
    </span>
  );
}
