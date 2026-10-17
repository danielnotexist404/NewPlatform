import { Circle, Globe, EyeOff } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { LP_STATUS } from "@/content/he/landing-pages";
import type { LandingStatus } from "@/lib/mock/landing-pages";

/** Landing page status — icon + text, never color alone (Part 01 §10.10). */
export function LandingStatusBadge({ status }: { status: LandingStatus }) {
  if (status === "published") {
    return (
      <Badge variant="success">
        <span aria-hidden className="size-1.5 animate-pulse-dot rounded-full bg-success" />
        <Globe aria-hidden />
        {LP_STATUS.published}
      </Badge>
    );
  }
  if (status === "unpublished") {
    return <Badge variant="outline"><EyeOff aria-hidden />{LP_STATUS.unpublished}</Badge>;
  }
  return <Badge><Circle aria-hidden />{LP_STATUS.draft}</Badge>;
}
